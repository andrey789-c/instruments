import { TableDetailPage } from '@/src/_pages/dashboard';

export default async function TablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TableDetailPage tableId={id} />;
}