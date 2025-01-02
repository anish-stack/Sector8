import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import JoditEditor from 'jodit-react';

const AdminPage = () => {
    const [pages, setPages] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        MainImage: '',
        HtmlContent: '',
        buttonText: '',
        buttonLink: '',
        b1: '',
        b2: '',
        isButton: true,
        isContentShow: true,
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const editor = useRef(null); // Ref for JoditEditor

    // Fetch all pages
    const fetchPages = async () => {
        try {
            const response = await axios.get('http://localhost:7485/api/v1/Other/get-free-page');
            setPages([response.data]); // Assuming response contains multiple pages
        } catch (error) {
            toast.error('Failed to fetch pages');
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Toggle field values
    const handleToggle = (name) => {
        setForm({ ...form, [name]: !form[name] });
    };

    // Create or update a page
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:7485/api/v1/Other/update_page/${editId}`, form);
                toast.success('Page updated successfully');
            } else {
                await axios.post('http://localhost:7485/api/v1/Other/create-page', form);
                toast.success('Page created successfully');
            }
            fetchPages();
            resetForm();
        } catch (error) {
            toast.error('Failed to save the page');
        }
    };

    // Delete a page
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:7485/api/v1/Other/delete_page/${id}`);
            toast.success('Page deleted successfully');
            fetchPages();
        } catch (error) {
            toast.error('Failed to delete the page');
        }
    };

    // Edit a page
    const handleEdit = (page) => {
        setForm(page);
        setIsEdit(true);
        setEditId(page._id);
    };

    // Reset the form
    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            MainImage: '',
            HtmlContent: '',
            buttonText: '',
            buttonLink: '',
            b1: '',
            b2: '',
            isButton: true,
            isContentShow: true,
        });
        setIsEdit(false);
        setEditId(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin: Free Space Pages</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6">
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="p-2 border rounded"
                        // required
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="p-2 border rounded"
                        // required
                    />
                    <input
                        type="text"
                        name="MainImage"
                        value={form.MainImage}
                        onChange={handleChange}
                        placeholder="Main Image URL"
                        className="p-2 border rounded"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">HTML Content</label>
                        <JoditEditor
                            ref={editor}
                            value={form.HtmlContent}
                            onChange={(content) => setForm({ ...form, HtmlContent: content })}
                        />
                    </div>
                    <input
                        type="text"
                        name="buttonText"
                        value={form.buttonText}
                        onChange={handleChange}
                        placeholder="Button Text"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="buttonLink"
                        value={form.buttonLink}
                        onChange={handleChange}
                        placeholder="Button Link"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="b1"
                        value={form.b1}
                        onChange={handleChange}
                        placeholder="Color 1 [eg: '#B1B1B1']"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="b2"
                        value={form.b2}
                        onChange={handleChange}
                        placeholder="Color 2[eg: '#B2B2B3']"
                        className="p-2 border rounded"
                    />
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="checkbox"
                                checked={form.isContentShow}
                                onChange={() => handleToggle('isContentShow')}
                            />
                            Show Content
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={form.isButton}
                                onChange={() => handleToggle('isButton')}
                            />
                            Show Button
                        </label>
                    </div>
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    {isEdit ? 'Update Page' : 'Create Page'}
                </button>
                {isEdit && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Existing Pages</h2>
                {pages.length > 0 ? (
                    pages.map((page) => (
                        <div key={page._id} className="border-b p-2">
                            <h3 className="font-semibold text-gray-700">{page.title}</h3>
                            <p className="text-gray-600">{page.description}</p>
                            <div dangerouslySetInnerHTML={{ __html: page.HtmlContent }} className="prose max-w-none"></div>
                            <p><strong>Button Text:</strong> {page.buttonText}</p>
                            <p><strong>Button Link:</strong> {page.buttonLink}</p>
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(page)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(page._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No pages available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
