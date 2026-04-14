import { TableDetailPage } from '@/src/_pages/dashboard';

export default function TablePage({ params }: { params: { id: string } }) {
  return <TableDetailPage tableId={params.id} />;
}