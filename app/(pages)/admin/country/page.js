import CountryManagementPage from '@/templates/admin/CountryManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | مدیریت کشورها',
};

export default function CountryManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <CountryManagementPage />
        </Suspense>
    );
}
