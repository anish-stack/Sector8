import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AllContact = () => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Items per page
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const fetchContacts = async () => {
        try {
            const { data } = await axios.get("https://api.naideal.com/api/v1/Other/get-contacts");
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Failed to fetch contacts!");
        }
    };

    const deleteContact = async (id) => {
        try {
            await axios.delete(`https://api.naideal.com/api/v1/Other/delete-contacts/${id}`);
            setContacts(contacts.filter((contact) => contact._id !== id));
            toast.success("Contact deleted successfully!");
        } catch (error) {
            console.error("Error deleting contact:", error);
            toast.error("Failed to delete contact!");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Filter, Search, and Sort
    const filteredContacts = contacts
        .filter((contact) =>
            search
                ? contact.Name.toLowerCase().includes(search.toLowerCase()) ||
                contact.Email.toLowerCase().includes(search.toLowerCase()) ||
                contact.PhoneNumber.includes(search)
                : true
        )
        .filter((contact) => {
            if (startDate && endDate) {
                const contactDate = new Date(contact.createdAt);
                return contactDate >= new Date(startDate) && contactDate <= new Date(endDate);
            }
            return true;
        })
        .sort((a, b) => {
            if (sortOrder === "asc") {
                return a[sortField] > b[sortField] ? 1 : -1;
            }
            return a[sortField] < b[sortField] ? 1 : -1;
        });

    // Pagination
    const totalPages = Math.ceil(filteredContacts.length / pageSize);
    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Contacts</h1>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    className="border p-2 rounded w-full sm:w-auto"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border cursor-pointer" onClick={() => handleSort("Name")}>
                                Name {sortField === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="p-2 border cursor-pointer" onClick={() => handleSort("PhoneNumber")}>
                                Phone {sortField === "PhoneNumber" && (sortOrder === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="p-2 border cursor-pointer" onClick={() => handleSort("Email")}>
                                Email {sortField === "Email" && (sortOrder === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="p-2 border cursor-pointer" onClick={() => handleSort("createdAt")}>
                                Date {sortField === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedContacts.map((contact) => (
                            <tr key={contact._id} className="text-center">
                                <td className="p-2 text-base border">{contact.Name}</td>
                                <td className="p-2 text-base border">{contact.PhoneNumber}</td>
                                <td className="p-2 text-base border">{contact.Email}</td>
                                <td className="p-2 text-base border">{new Date(contact.createdAt).toLocaleDateString()}</td>
                                <td className="p-2 text-base border">
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        onClick={() => deleteContact(contact._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllContact;
