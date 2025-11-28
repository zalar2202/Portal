import ClientManagementPage from '@/templates/admin/ClientManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | مدیریت متقاضیان',
};

export default function ClientManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ClientManagementPage />
        </Suspense>
    );
}
