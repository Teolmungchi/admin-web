'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Brain, ChevronDown, Database, Eye, History, Info, LayoutDashboard, LogOut, PawPrint, Settings, Shield, UserCog, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SidebarItem = {
  title: string;
  href?: string;
  icon: React.ReactNode;
  submenu?: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
};

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '사용자 및 권한 관리': true,
    '동물 데이터 관리': false,
    'AI 모델 관리': false,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const sidebarItems: SidebarItem[] = [
    {
      title: '대시보드',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
      {
        title: '사용자 및 권한 관리',
        href: '/dashboard/users/members',
        icon: <UserCog className="h-4 w-4" />,
      },
      // submenu: [
      //   {
      //     title: '회원 목록 및 상세 정보',
      //     href: '/dashboard/users/members',
      //     icon: <UserCog className="h-4 w-4" />,
      //   },
        // {
        //   title: '관리자 역할/권한 관리',
        //   href: '/dashboard/users/roles',
        //   icon: <Shield className="h-4 w-4" />,
        // },
      // ],
    // },
    {
      title: '동물 데이터 관리',
      icon: <PawPrint className="h-5 w-5" />,
      submenu: [
        {
          title: '실종/보호 동물 목록 관리',
          href: '/dashboard/animals/list',
          icon: <Database className="h-4 w-4" />,
        },
        {
          title: 'AI 유사도 매칭 결과 이력',
          href: '/dashboard/animals/matching-history',
          icon: <History className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'AI 모델 관리',
      icon: <Brain className="h-5 w-5" />,
      submenu: [
        {
          title: '유사도 추출 모델 관리',
          href: '/dashboard/ai/model-version',
          icon: <Database className="h-4 w-4" />,
        },
        {
          title: '얼굴인식 모델 관리',
          href: '/dashboard/ai/face-recognition',
          icon: <Eye className="h-4 w-4" />,
        },
        {
          title: '설정/파라미터 관리',
          href: '/dashboard/ai/parameters',
          icon: <Settings className="h-4 w-4" />,
        },
        {
          title: '현재 모델 버전 정보',
          href: '/dashboard/ai/current-version',
          icon: <Info className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">셜록냥즈 관리자</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link href={item.href}>
                  <span
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md w-full',
                      pathname === item.href
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md w-full',
                    'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', openMenus[item.title] ? 'transform rotate-180' : '')} />
                </button>
              )}

              {item.submenu && openMenus[item.title] && (
                <div className="mt-1 space-y-1 pl-6">
                  {item.submenu.map((subItem) => (
                    <Link key={subItem.title} href={subItem.href}>
                      <span
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                          pathname === subItem.href
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                        )}
                      >
                        {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                        {subItem.title}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" className="w-full justify-start" onClick={() => signOut({ callbackUrl: '/login' })}>
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
