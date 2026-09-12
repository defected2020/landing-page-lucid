import AdminLayout from '../../../../components/admin/AdminLayout';
import DocEditor from '../../../../components/admin/DocEditor';
import { withAdminPage } from '../../../../lib/admin/api';
import { getDoc } from '../../../../lib/admin/store';

export const getServerSideProps = withAdminPage(async ({ params }) => {
  const doc = await getDoc(params.id);
  if (!doc) return { notFound: true };
  return { props: { doc } };
});

export default function EditDoc({ adminUser, storageMode, doc }) {
  return (
    <AdminLayout user={adminUser} storageMode={storageMode} title="Edit document">
      <DocEditor doc={doc} key={doc.id} />
    </AdminLayout>
  );
}
