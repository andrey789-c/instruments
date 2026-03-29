import { Suspense } from 'react';
import { ResetPassword } from '@/src/_pages/auth';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}