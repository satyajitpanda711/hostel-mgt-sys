'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDatabase = () => {
    const [search, setSearch] = useState('');
    const [blockFilter, setBlockFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    /* =========================
       Fetch Students
    ========================= */
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/admin/student_database');
                if (response.data.success) {
                    setStudents(response.data.students);
                } else {
                    toast.error(response.data.message);
                }
            } catch {
                toast.error('Error fetching students.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedStudent]);

    /* =========================
       Filters
    ========================= */
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name?.toLowerCase().includes(search.toLowerCase()) ||
            student.studentId?.toLowerCase().includes(search.toLowerCase());

        const matchesBlock =
            blockFilter === '' ||
            student.room?.hostelBlock === blockFilter;

        const matchesGender =
            genderFilter === '' ||
            student.gender === genderFilter;

        return matchesSearch && matchesBlock && matchesGender;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <ToastContainer />

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Student Database
                    </h1>
                    <p className="text-blue-100 mt-2 text-sm">
                        Manage and monitor hostel students
                    </p>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        />

                        <select
                            value={blockFilter}
                            onChange={(e) => setBlockFilter(e.target.value)}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                            <option value="">All Blocks</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                        </select>

                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                {['Name', 'Reg No', 'Year', 'Room', 'Block', 'Gender', 'Gym', 'Actions']
                                    .map((header) => (
                                        <th key={header} className="px-6 py-3 text-left font-medium">
                                            {header}
                                        </th>
                                    ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student._id} className="border-t hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4">{student.studentId}</td>
                                    <td className="px-6 py-4">{student.year}</td>
                                    <td className="px-6 py-4">
                                        {student.room?.roomNumber ?? 'Not Allotted'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.room?.hostelBlock ?? 'Not Allotted'}
                                    </td>
                                    <td className="px-6 py-4">{student.gender}</td>
                                    <td className="px-6 py-4">
                                        {student.gym ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedStudent(student)}
                                            className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-500 transition"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-slate-500">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">

                    <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 relative p-8">

                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-2xl font-semibold text-slate-900 mb-8">
                            Student Profile
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">

                            <Info label="Name" value={selectedStudent.name} />
                            <Info label="Student ID" value={selectedStudent.studentId} />
                            <Info label="Email" value={selectedStudent.email} />
                            <Info label="Phone" value={selectedStudent.phoneNumber} />
                            <Info label="Parent Phone" value={selectedStudent.parentPhoneNumber} />
                            <Info label="Gender" value={selectedStudent.gender} />
                            <Info label="Year" value={selectedStudent.year} />
                            <Info label="Block" value={selectedStudent.room?.hostelBlock ?? 'Not Allotted'} />
                            <Info label="Room" value={selectedStudent.room?.roomNumber ?? 'Not Allotted'} />
                            <Info label="Gym Access" value={selectedStudent.gym ? 'Yes' : 'No'} />
                            <Info label="Mess" value={selectedStudent.mess ?? 'Not Allotted'} />
                            <Info
                                label="Date of Birth"
                                value={
                                    selectedStudent.dob
                                        ? new Date(selectedStudent.dob).toLocaleDateString()
                                        : 'N/A'
                                }
                            />
                            <Info label="Fees Records" value={selectedStudent.fees?.length ?? 0} />
                            <Info label="Complaints" value={selectedStudent.complaints?.length ?? 0} />
                            <Info label="Leaves" value={selectedStudent.leaves?.length ?? 0} />
                            <Info label="Feedback" value={selectedStudent.feedback?.length ?? 0} />

                            <div className="md:col-span-2">
                                <Info label="Address" value={selectedStudent.address} />
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* Reusable Info Component */
const Info = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-900">{value ?? 'N/A'}</p>
    </div>
);

export default StudentDatabase;