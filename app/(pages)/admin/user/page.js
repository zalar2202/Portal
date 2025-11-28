import UserManagementPage from '@/templates/admin/UserManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | مدیریت افراد مجموعه',
};

export default function UserManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserManagementPage />
        </Suspense>
    );
}
