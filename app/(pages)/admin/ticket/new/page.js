import UserNewTicketPage from '@/templates/admin/UserNewTicketPage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | تیکت جدید',
};

export default function UserNewTicket() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <UserNewTicketPage />
        </Suspense>
    );
}
