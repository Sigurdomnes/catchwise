import { useState } from 'react';
import { Center, SegmentedControl, rem } from '@mantine/core';
import { IconEye, IconCode, IconExternalLink, IconFishHook, IconFish } from '@tabler/icons-react';
import {
    IconShoppingCart,
    IconLicense,
    IconMessage2,
    IconBellRinging,
    IconMessages,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconUsers,
    IconFileAnalytics,
    IconDatabaseImport,
    IconReceipt2,
    IconReceiptRefund,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import classes from './NavbarSegmented.module.css';
import { UserButton } from './UserButton';
import Link from 'next/link';

const tabs = {
    preview: [
        { link: '/bluewild', label: 'Bluewild AS', icon: IconFish },
        { link: '/fishandchips', label: 'Fish and Chips AS', icon: IconFish },
    ],
    edit: [
        { link: '/bluewild/edit', label: 'Bluewild AS', icon: IconFish },
        { link: '/fishandchips/edit', label: 'Fish and Chips AS', icon: IconFish },
    ],
};

export function NavbarSegmented() {
    const [section, setSection] = useState<'preview' | 'edit'>('preview');
    const [active, setActive] = useState('Billing');

    const links = tabs[section].map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
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
                    onChange={(value: any) => setSection(value)}
                    transitionTimingFunction="ease"
                    fullWidth
                    bg="dark.0"
                    color="blue"
                    autoContrast={true}
                    data={[
                        {
                            value: 'preview',
                            label: (
                                <Center style={{ gap: 10 }}>
                                    <IconEye style={{ width: rem(16), height: rem(16) }} />
                                    <span>Preview</span>
                                </Center>
                            )
                        },
                        {
                            value: 'edit',
                            label: (
                                <Center style={{ gap: 10 }}>
                                    <IconCode style={{ width: rem(16), height: rem(16) }} />
                                    <span>Edit</span>
                                </Center>
                            ),
                        },
                    ]}
                />
            </div>

            <div className={classes.navbarMain}>{links}</div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                    <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}