import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllAccounts } from '@/services/ApiServices/accountService';
import { Paper } from '@mui/material';

const ListProvidersCard = () => {
  const [providers, setProviders] = useState<any>(null);
  const [_error, setError] = useState<string>("");
  const [_loading, setLoading] = useState<boolean>(false);

  const fetchProviders = async () => {
    try {
      const response = await getAllAccounts();
      setProviders(response.filter((provider: any) => provider.roleName == "Provider"));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Service Providers
      </h4>

      <Paper elevation={3} style={{marginBottom:'10px', padding: "20px", borderRadius: "10px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#419f97", color: "white", textAlign: "left" }}>
                <th style={{ padding: "12px", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "12px", fontWeight: "600" }}>Username</th>
                <th style={{ padding: "12px", fontWeight: "600" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {providers && providers.length > 0 ? (
                providers.map((provider: any, index: number) => (
                  <tr
                    key={provider.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#fff")
                    }
                  >
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500" }}>
                      {provider.id}
                    </td>

                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500" }}>
                      {provider.username}
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500" }}>
                      {provider.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px", fontSize: "18px", color: "#888" }}>
                    No providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>

    </div>
  );
};

export default ListProvidersCard;
