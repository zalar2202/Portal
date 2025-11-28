import ContractManagementPage from '@/templates/admin/ContractManagementPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | مدیریت قراردادها',
};

export default function ContractManagement() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <ContractManagementPage />
        </Suspense>
    );
}
