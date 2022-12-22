import { useQuery } from "@apollo/client";
import ClientRow from "./ClientRow"
import { GET_CLIENTS } from "../queries/clientQueries";
import Spinner from "./Spinner"

export default function Clients() {
    const { loading, error, data } = useQuery(GET_CLIENTS)

    if (loading) return <Spinner />;
    if (error) return <p>Something went wrong</p>;

    return <>{!loading && !error && (
        <table className="table table-hover mt-3">  
            {/* thead = table head */}
            <thead>
                {/* tr = table row */}
                <tr>
                    {/* th = table headings */}
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {/* clients on the next line comes from imported GET_CLEINTS query */}
                {data.clients.map(client => (
                    <ClientRow key ={client.id} client={client} />
                ))}
            </tbody>
        </table>
    )}</>;
}
