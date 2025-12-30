import * as React from "react";
import {
    Loader2,
    Send,
    Sparkles,
    SettingsIcon,
    Paperclip,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { ApiKeyDialog, GATEWAY_API_KEY_STORAGE_KEY } from "../../api-key-dialog";
import { useEditorStore } from "../use-editor";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import type {
    BuildModeChatUIMessage,
    GenerateModeChatUIMessage,
} from "@/ai/messages/types";
import {
    InputGroup,
    InputGroupTextarea,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";
import {
    captureSelectedBlocksAsImage,
    calculateSelectedBlocksBounds,
} from "../services/export";
import { EXPORT_PADDING } from "../utils/constants";
import type { SelectionBounds } from "@/lib/types";
import { transport } from "../../demo-transport";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useOrderedBlocks } from "../hooks/use-ordered-blocks";

export function AiChatPanel() {
    const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);

    // Editor State
    const blocks = useOrderedBlocks();
    const selectedIds = useEditorStore((state) => state.selectedIds);
    const blocksById = useEditorStore((state) => state.blocksById);
    const stage = useEditorStore((state) => state.stage);

    // Chat State
    const [input, setInput] = React.useState("");

    const chatAttachments = useEditorStore((state) => state.chatAttachments);
    const setChatAttachments = useEditorStore((state) => state.setChatAttachments);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const [apiKey] = useLocalStorage<string>(
        GATEWAY_API_KEY_STORAGE_KEY,
        ""
    );

    const { sendMessage, status } = useChat<
        BuildModeChatUIMessage | GenerateModeChatUIMessage
    >({
        id: apiKey,
        transport: apiKey === "demo" ? transport : undefined,
        onError: (error) => {
            const errorMessage = error.message?.toLowerCase() || "";
            const isAuthError =
                errorMessage.includes("unauthorized") ||
                errorMessage.includes("api key") ||
                errorMessage.includes("401");

            if (isAuthError) {
                toast.error("Invalid or missing API key. Please check your settings.");
                setShowApiKeyDialog(true);
            } else {
                toast.error(error.message || "An error occurred with the AI service");
            }
        },
        onFinish: (message) => {
            // Handle finish if needed
        },
    });

    const isLoading = status === "submitted" || status === "streaming";

    // Auto-resize textarea
    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [input]);

    // Sync selection to chat attachments
    const prevSelectedIdsRef = React.useRef<string[]>([]);
    React.useEffect(() => {
        // Compare arrays shallowly
        const isSame = selectedIds.length === prevSelectedIdsRef.current.length &&
            selectedIds.every((id, i) => id === prevSelectedIdsRef.current[i]);

        if (isSame) return;

        prevSelectedIdsRef.current = selectedIds;

        if (selectedIds.length > 0) {
            const selectedImages = selectedIds
                .map(id => blocksById[id])
                .filter(b => b?.type === "image" && b.url);

            if (selectedImages.length > 0) {
                Promise.all(selectedImages.map(async (block) => {
                    const imageBlock = block as { url?: string; label?: string; type: string };
                    try {
                        if (!imageBlock.url) return null;
                        const res = await fetch(imageBlock.url);
                        const blob = await res.blob();
                        const file = new File([blob], imageBlock.label || "image.png", { type: blob.type });
                        return { file, url: imageBlock.url };
                    } catch (err) {
                        console.error("Failed to fetch image for chat", err);
                        return null;
                    }
                })).then(attachments => {
                    const validAttachments = attachments.filter(a => a !== null) as { file: File; url: string }[];
                    if (validAttachments.length > 0) {
                        setChatAttachments(validAttachments);
                        // Optional: toast specific to count
                        if (validAttachments.length === 1) toast.success("Image attached to chat context");
                        else toast.success(`${validAttachments.length} images attached to chat context`);
                    }
                });
            }
        }
    }, [selectedIds, blocksById, setChatAttachments]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                // Append or replace? Usually replacing entire context for new "user intent" or appending?
                // Use-cases vary. Let's append if user explicitly adds file, but maybe replace context if it was auto-selected?
                // For simplicity and clarity, let's Append to existing for explicit file upload.
                setChatAttachments([...chatAttachments, { file, url }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        const newAttachments = chatAttachments.filter((_, i) => i !== indexToRemove);
        setChatAttachments(newAttachments);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = React.useCallback(
        async (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if ((!input.trim() && chatAttachments.length === 0) || isLoading) return;

            const buildRequestBody = (selectionBounds?: SelectionBounds | null) => ({
                ...(apiKey ? { gatewayApiKey: apiKey } : {}),
                ...(selectionBounds ? { selectionBounds } : {}),
            });

            try {
                const canvasImage = await captureSelectedBlocksAsImage(
                    stage,
                    blocks,
                    selectedIds
                );

                let selectionBounds: SelectionBounds | null = null;
                if (selectedIds.length > 0) {
                    const boundsWithPadding = calculateSelectedBlocksBounds(
                        blocks,
                        selectedIds
                    );
                    if (boundsWithPadding) {
                        selectionBounds = {
                            x: boundsWithPadding.x + EXPORT_PADDING,
                            y: boundsWithPadding.y + EXPORT_PADDING,
                            width: boundsWithPadding.width - EXPORT_PADDING * 2,
                            height: boundsWithPadding.height - EXPORT_PADDING * 2,
                        };
                    }
                }

                const files = [];
                if (canvasImage) {
                    files.push({
                        type: "file" as const,
                        mediaType: "image/png" as const,
                        url: canvasImage,
                    });
                }
                if (chatAttachments.length > 0) {
                    chatAttachments.forEach(att => {
                        files.push({
                            type: "file" as const,
                            mediaType: att.file.type as any,
                            url: att.url,
                        });
                    });
                }

                sendMessage(
                    { text: input, files: files.length > 0 ? files : undefined },
                    { body: buildRequestBody(selectionBounds) }
                );
                setInput("");
                setChatAttachments([]);
                if (fileInputRef.current) fileInputRef.current.value = "";
            } catch {
                sendMessage({ text: input }, { body: buildRequestBody() });
                setInput("");
                setChatAttachments([]);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        },
        [
            input,
            chatAttachments,
            isLoading,
            apiKey,
            sendMessage,
            stage,
            blocks,
            blocks,
            selectedIds,
            setChatAttachments,
        ]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex-1 flex flex-col border border-border/50 bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] overflow-hidden min-h-0">
            <div className="p-4 border-b flex items-center gap-2 bg-muted/20">
                <Sparkles className="size-4 text-purple-500" />
                <span className="font-semibold text-sm">AI Assistant</span>
                <div className="ml-auto flex items-center gap-1">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full"
                        onClick={() => setShowApiKeyDialog(true)}
                    >
                        <SettingsIcon className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Describe what you want to create or edit. You can select elements on the canvas to reference them in your prompt.
                    </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    {chatAttachments.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-thin">
                            {chatAttachments.map((att, index) => (
                                <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border border-border group shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={att.url}
                                        alt="Attachment"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => handleRemoveAttachment(index)}
                                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <InputGroup className="w-full">
                        <InputGroupTextarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe what to create..."
                            disabled={isLoading}
                            rows={3}
                            className={cn(
                                "min-h-[80px] max-h-[200px] text-foreground p-3 resize-none",
                                "placeholder:text-muted-foreground/50"
                            )}
                        />
                        <InputGroupAddon align="inline-end" className="flex flex-col gap-1 py-1 pr-1">
                            <InputGroupButton
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                                <Paperclip className="size-4" />
                            </InputGroupButton>
                            <InputGroupButton
                                variant="secondary"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading || (!input.trim() && chatAttachments.length === 0)}
                                className="h-8 w-8"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin size-4" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            <ApiKeyDialog
                open={showApiKeyDialog}
                onOpenChange={setShowApiKeyDialog}
            />
        </div>
    );
}
