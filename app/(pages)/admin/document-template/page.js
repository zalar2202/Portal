import DocTemplateManagementPage from '@/templates/admin/DocTemplateManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | نمونه قالب فایل ها',
};

export default function DocTemplateManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <DocTemplateManagementPage />
        </Suspense>
    );
}
