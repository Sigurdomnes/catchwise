import { useEffect, useState } from 'react';
import { Center, SegmentedControl, rem } from '@mantine/core';
import { IconEye, IconCode, IconFishHook, IconFish } from '@tabler/icons-react';
import classes from './NavbarSegmented.module.css';
import { UserButton } from './UserButton';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isNullOrUndefined } from 'util';

const tabs = {
    preview: [
        { link: '/bluewild', label: 'Bluewild AS', icon: IconFish },
        { link: '/fishandchips', label: 'Fish and Chips AS', icon: IconFishHook },
    ],
    edit: [
        { link: '/bluewild/edit', label: 'Bluewild AS', icon: IconFish },
        { link: '/fishandchips/edit', label: 'Fish and Chips AS', icon: IconFishHook },
    ],
};

export function NavbarSegmented() {
    const [section, setSection] = useState<'preview' | 'edit'>('preview');
    const [active, setActive] = useState<string | null>(null);
    const path = usePathname();
    const router = useRouter();

    useEffect(() => {
        const active = ([...tabs.edit, ...tabs.preview].find((tab: { link: string}) => tab.link === path))
        setActive(active ? active.label : null)
        const section = active?.link.includes('edit');
        setSection(section ? 'edit' : 'preview')
    })

    const handleEditChange = (value: 'edit' | 'preview') => {
        if (active) {
            const tab = (tabs[value].find((tab: { label: string}) => tab.label === active))
            router.push(tab ? tab.link : '/404')
        }
    }

    const links = tabs[section].map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <nav className={classes.navbar}>
            <div>
            <UserButton />
                <SegmentedControl
                    value={section}
                    onChange={
                        (value: any) => { 
                        setSection(value);
                        handleEditChange(value);
                        }
                    }
                    transitionTimingFunction="ease"
                    fullWidth
                    bg="dark.6"
                    color="cyan.9"
                    data={[
                        {
                            value: 'preview',
                            label: (
                                <Center style={{ gap: 10, color: '#eee' }}>
                                    <IconEye style={{ width: rem(16), height: rem(16) }} />
                                    <span>Preview</span>
                                </Center>
                            )
                        },
                        {
                            value: 'edit',
                            label: (
                                <Center style={{ gap: 10, color: '#eee' }}>
                                    <IconCode style={{ width: rem(16), height: rem(16) }} />
                                    <span>Edit</span>
                                </Center>
                            ),
                        },
                    ]}
                />
            </div>
            <div className={classes.navbarMain}>{links}</div>
        </nav>
    );
}