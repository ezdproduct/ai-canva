"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Monitor, Smartphone, Type, LayoutTemplate } from "lucide-react";

interface SizePickerDialogProps {
    open: boolean;
    onSelectSize: (width: number, height: number) => void;
    onClose: () => void;
}

const PRESETS = [
    {
        category: "Social Media",
        icon: <Smartphone className="w-4 h-4" />,
        items: [
            { name: "Instagram Post", width: 1080, height: 1080 },
            { name: "Instagram Story", width: 1080, height: 1920 },
            { name: "Twitter Post", width: 1600, height: 900 },
            { name: "Facebook Post", width: 1200, height: 630 },
        ],
    },
    {
        category: "Presentation",
        icon: <Monitor className="w-4 h-4" />,
        items: [
            { name: "Presentation (16:9)", width: 1920, height: 1080 },
            { name: "Presentation (4:3)", width: 1024, height: 768 },
        ],
    },
    {
        category: "Print",
        icon: <LayoutTemplate className="w-4 h-4" />,
        items: [
            { name: "A4 Document", width: 595, height: 842 }, // 72 PPI
            { name: "Letter", width: 612, height: 792 },
        ],
    },
];

export function SizePickerDialog({ open, onSelectSize, onClose }: SizePickerDialogProps) {
    const [width, setWidth] = React.useState(1080);
    const [height, setHeight] = React.useState(1080);

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSelectSize(width, height);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent
                className="max-w-3xl"
                onInteractOutside={(e) => e.preventDefault()}
                overlayClassName="bg-transparent"
            >
                <DialogHeader className="relative">
                    <DialogTitle>Choose a canvas size</DialogTitle>
                    <DialogDescription>
                        Select a preset or create a custom size to start your design.
                    </DialogDescription>

                </DialogHeader>

                <Tabs defaultValue="presets" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="presets">Presets</TabsTrigger>
                        <TabsTrigger value="custom">Custom Size</TabsTrigger>
                    </TabsList>

                    <TabsContent value="presets" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
                            {PRESETS.map((category) => (
                                <div key={category.category} className="col-span-full">
                                    <h3 className="flex items-center gap-2 font-medium mb-3 text-sm text-muted-foreground">
                                        {category.icon}
                                        {category.category}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {category.items.map((preset) => (
                                            <Card
                                                key={preset.name}
                                                className="cursor-pointer hover:border-primary/50 transition-colors"
                                                onClick={() => onSelectSize(preset.width, preset.height)}
                                            >
                                                <CardHeader className="p-4 pb-2">
                                                    <CardTitle className="text-base">{preset.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-xs text-muted-foreground">
                                                        {preset.width} x {preset.height} px
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="custom">
                        <form onSubmit={handleCustomSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Custom Dimensions</CardTitle>
                                    <CardDescription>
                                        Enter the width and height in pixels.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="width">Width (px)</Label>
                                            <Input
                                                id="width"
                                                type="number"
                                                min="1"
                                                max="10000"
                                                value={width}
                                                onChange={(e) => setWidth(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="height">Height (px)</Label>
                                            <Input
                                                id="height"
                                                type="number"
                                                min="1"
                                                max="10000"
                                                value={height}
                                                onChange={(e) => setHeight(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full">
                                        Create Design
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
