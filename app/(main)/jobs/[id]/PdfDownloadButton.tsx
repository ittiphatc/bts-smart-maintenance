"use client"

import dynamic from "next/dynamic"

interface JobData {
    id: number
    jobNo: string
    location: string
    subject: string
    description: string
    reportedBy: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
    completedAt: string | null
    photoUrl: string | null
}

// Wrap ทั้ง PDFDownloadLink + JobOrderPDF ไว้ใน Component เดียว
// เพื่อหลีกเลี่ยงปัญหา dynamic import กับ named exports
const PdfDownloadInner = dynamic(
    () =>
        import("@react-pdf/renderer").then((pdfMod) =>
            import("@/app/components/JobOrderPDF").then((jobMod) => {
                const { PDFDownloadLink } = pdfMod
                const { JobOrderPDF } = jobMod

                // Return a proper React component
                function PdfDownload({ job }: { job: JobData }) {
                    return (
                        <PDFDownloadLink
                            document={<JobOrderPDF job={job} />}
                            fileName={`JobOrder-${job.jobNo}.pdf`}
                        >
                            {({ loading }) => (
                                <button
                                    className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium text-sm shadow-lg shadow-purple-600/25 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "⏳ กำลังสร้างเอกสาร..." : "🖨️ พิมพ์ใบงาน (PDF)"}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )
                }

                return PdfDownload
            })
        ),
    {
        ssr: false,
        loading: () => (
            <button
                className="px-5 py-2.5 bg-purple-300 text-white rounded-xl font-medium text-sm"
                disabled
            >
                ⏳ กำลังโหลด...
            </button>
        ),
    }
)

export default function PdfDownloadButton({ job }: { job: JobData }) {
    return <PdfDownloadInner job={job} />
}