import HomePage from '@/templates/HomePage';
import { Suspense } from 'react';

export const metadata = {
    title: 'ویستا | پنل مدیریت قرارداد',
};

export default function Home() {
    return (
        <Suspense
            fallback={<div className="suspense">در حال بارگذاری ...</div>}
        >
            <HomePage />
        </Suspense>
    );
}
