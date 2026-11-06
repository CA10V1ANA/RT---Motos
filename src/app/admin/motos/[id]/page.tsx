import { MotoWizard } from "@/components/admin/moto-wizard";
export default async function EditarMoto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MotoWizard id={id} />;
}
