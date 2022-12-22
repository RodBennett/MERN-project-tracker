import { FaTrash } from "react-icons/fa"
import { useMutation } from "@apollo/client"

// DELETE_CLIENT is imported here because this is where the delete button is
import { DELETE_CLIENT } from "../mutations/clientMutations"
import { GET_CLIENTS } from "../queries/clientQueries"

export default function ClientRow( { client } ) {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: { id: client.id },
        // method 1 on how to update page immediately upon delete: use refetchQueries
        // refetchQueries: [ {query: GET_CLIENTS} ]
        
        // method 2 on how to update page immediately upon delete
        update(cache, { data: { deleteClient } }) {
            const { clients } = cache.readQuery({ query: 
                GET_CLIENTS });
            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: clients.filter(client => client.id !== deleteClient.id),
                 }
            });
        },     
    });


  return (
        <tr> 
            {/* <td> = 'table data cell */}
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
                <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                    <FaTrash />
                </button>
            </td>
        </tr>
  )
}
