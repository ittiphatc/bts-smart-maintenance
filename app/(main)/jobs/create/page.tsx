import CreateJobForm from "./CreateJobForm"

export default function CreateJobPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">📝 แจ้งซ่อมใหม่</h1>
                    <p className="text-gray-500 mt-1">กรอกข้อมูลด้านล่างเพื่อสร้างใบแจ้งซ่อม</p>
                </div>

                {/* Form */}
                <CreateJobForm />
            </div>
        </div>
    )
}