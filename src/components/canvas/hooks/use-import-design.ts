import { useRef, useCallback } from "react";
import { toast } from "sonner";
import { useEditorStore } from "../use-editor";

export function useImportDesign() {
    const loadTemplate = useEditorStore((state) => state.loadTemplate);
    const importInputRef = useRef<HTMLInputElement>(null);

    const triggerImport = useCallback(() => {
        importInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Handle JSON Import
        if (file.type === "application/json" || file.name.endsWith(".json")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = e.target?.result as string;
                    let template;
                    try {
                        template = JSON.parse(json);
                    } catch {
                        throw new Error("Invalid JSON syntax");
                    }

                    // loadTemplate calls parseTemplate which defines strict Zod validation
                    // If validation fails, it throws an error which we catch here
                    loadTemplate(template);

                    toast.success("Design imported successfully");
                } catch (error) {
                    console.error("Failed to import design", error);
                    let message = "Invalid or corrupted file.";

                    // Try to extract readable Zod error or fallback
                    if (error instanceof Error) {
                        // Zod errors usually have details, but the message might be generic "Invalid input"
                        // Depending on how Zod is configured.
                        // But for now, using the error message is better than nothing.
                        try {
                            // If it's a Zod error it usually has an 'issues' array, but here we just catch standard Error
                            const issues = (error as any).issues;
                            if (Array.isArray(issues) && issues.length > 0) {
                                message = `Validation failed: ${issues[0].message} at ${issues[0].path.join('.')}`;
                            } else {
                                message = error.message;
                            }
                        } catch {
                            message = error.message;
                        }
                    }
                    toast.error(`Import failed: ${message}`);
                } finally {
                    if (importInputRef.current) {
                        importInputRef.current.value = "";
                    }
                }
            };
            reader.readAsText(file);
            return;
        }

        // Handle Image Import
        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            // Previously: store.getState().setChatAttachment({ file, url });
            // Now:
            useEditorStore.getState().setChatAttachments([{ file, url }]);
            toast.success("Image attached to AI Assistant");
            if (importInputRef.current) importInputRef.current.value = "";
            return;
        }

        toast.error("Unsupported file type. Please upload a JSON or Image file.");
        if (importInputRef.current) {
            importInputRef.current.value = "";
        }
    }, [loadTemplate]);

    return {
        importInputRef,
        triggerImport,
        handleFileChange,
    };
}
