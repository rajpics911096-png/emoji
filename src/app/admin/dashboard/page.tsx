'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Smile, FilePlus, Download, ArrowRight, Tags, PlusCircle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { emojis, pages, categories } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/context/translations-context';

export default function DashboardPage() {
    const { t } = useTranslations();
    const [emojiCount, setEmojiCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [downloadCount, setDownloadCount] = useState(0);

    useEffect(() => {
        setEmojiCount(emojis.length);
        setPageCount(pages.length);
        setCategoryCount(categories.length - 1); // Subtract "All" category

        const storedDownloads = localStorage.getItem('downloadCount');
        if (storedDownloads) {
            setDownloadCount(parseInt(storedDownloads, 10));
        }
    }, []);

    const stats = [
        { title: t('dashboard_total_emojis'), value: emojiCount.toLocaleString(), icon: Smile, change: "20.1%", color: "bg-blue-500" },
        { title: t('dashboard_total_pages'), value: pageCount.toLocaleString(), icon: FilePlus, change: "5", color: "bg-green-500" },
        { title: t('dashboard_total_categories'), value: categoryCount.toLocaleString(), icon: Tags, change: "2", color: "bg-yellow-500" },
        { title: t('dashboard_total_downloads'), value: downloadCount.toLocaleString(), icon: Download, change: "22%", color: "bg-red-500" },
    ];

    const quickActions = [
        { label: t('dashboard_add_emoji'), href: '/admin/emojis', icon: PlusCircle },
        { label: t('dashboard_add_page'), href: '/admin/pages', icon: FilePlus },
        { label: t('dashboard_manage_categories'), href: '/admin/categories', icon: ArrowRight },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl font-headline font-bold">{t('dashboard_title')}</h1>
        
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
                <p className="text-xs text-muted-foreground">{t('dashboard_stat_change', { change: stat.change })}</p>
                </CardContent>
            </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>{t('dashboard_analytics_title')}</CardTitle>
                    <CardDescription>{t('dashboard_analytics_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-10">{t('dashboard_analytics_placeholder')}</p>
                </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>{t('dashboard_quick_actions_title')}</CardTitle>
                <CardDescription>{t('dashboard_quick_actions_desc')}</CardDescription>
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

    