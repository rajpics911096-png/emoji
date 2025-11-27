'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Smile, Users, Eye, Download, PlusCircle, FilePlus, ArrowRight, Tags } from "lucide-react";
import { Button } from '@/components/ui/button';
import { emojis, pages, categories } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    // This is a temporary solution to simulate dynamic data fetching.
    // In a real app, this would be fetched from a server.
    const [emojiCount, setEmojiCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);

    useEffect(() => {
        setEmojiCount(emojis.length);
        setPageCount(pages.length);
        // Subtracting 1 for the "All" category which is not a real user-added category
        setCategoryCount(categories.length - 1);
    }, []);

    const stats = [
        { title: "Total Emojis", value: emojiCount.toLocaleString(), icon: Smile, change: "+20.1% from last month", color: "bg-blue-500" },
        { title: "Total Pages", value: pageCount.toLocaleString(), icon: FilePlus, change: "+5 from last month", color: "bg-green-500" },
        { title: "Total Categories", value: categoryCount.toLocaleString(), icon: Tags, change: "+2 from last month", color: "bg-yellow-500" },
        { title: "Total Downloads", value: "1,234,567", icon: Download, change: "+22% from last month", color: "bg-red-500" },
    ];

    const quickActions = [
        { label: 'Add New Emoji', href: '/admin/emojis', icon: PlusCircle },
        { label: 'Add New Page', href: '/admin/pages', icon: FilePlus },
        { label: 'Manage Categories', href: '/admin/categories', icon: ArrowRight },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
            <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full text-primary-foreground ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                </div>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
            </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                    <CardDescription>A summary of your website's performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-10">Charts and detailed analytics coming soon.</p>
                </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Quickly jump to common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                {quickActions.map(action => (
                    <Button key={action.href} asChild variant="outline" className="justify-start">
                        <Link href={action.href}>
                            <action.icon className="mr-2 h-4 w-4"/>
                            {action.label}
                        </Link>
                    </Button>
                ))}
            </CardContent>
            </Card>
        </div>
        </div>
    );
}
