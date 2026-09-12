import AdminLayout from '../../../components/admin/AdminLayout';
import DocEditor from '../../../components/admin/DocEditor';
import { withAdminPage } from '../../../lib/admin/api';

export const getServerSideProps = withAdminPage();

export default function NewDoc({ adminUser, storageMode }) {
  return (
    <AdminLayout user={adminUser} storageMode={storageMode} title="New document">
      <DocEditor />
    </AdminLayout>
  );
}
