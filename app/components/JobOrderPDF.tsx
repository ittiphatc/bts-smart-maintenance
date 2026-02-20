import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"

// ============================================
// ลงทะเบียนฟอนต์ภาษาไทย (Sarabun)
// ต้องวางไฟล์ .ttf ไว้ที่ public/fonts/
// ============================================
Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Sarabun-Bold.ttf", fontWeight: "bold" },
  ],
})

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, lineHeight: 1.6, fontFamily: "Sarabun" },
  headerContainer: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 20, borderBottomWidth: 2, borderBottomColor: "#1e40af", paddingBottom: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1e40af" },
  jobNoValue: { fontSize: 14, fontWeight: "bold", color: "#1e40af" },
  sectionTitle: {
    fontSize: 13, fontWeight: "bold", backgroundColor: "#f3f4f6", padding: 8, borderRadius: 4, marginBottom: 10,
  },
  row: { flexDirection: "row", marginBottom: 8 },
  label: { width: 120, fontWeight: "bold", color: "#374151", fontSize: 10 },
  value: { flex: 1, color: "#1f2937", fontSize: 10 },
  descriptionBox: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 4, padding: 12, marginTop: 10, minHeight: 80 },
  signatureSection: { marginTop: 50, flexDirection: "row", justifyContent: "space-between" },
  signatureLine: { borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", marginBottom: 5 },
})

export const JobOrderPDF = ({ job }: { job: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header: BTS Smart Maintenance + Job No */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>BTS Smart Maintenance</Text>
          <Text style={{ fontSize: 10, color: "#6b7280" }}>Maintenance Job Order / Report</Text>
        </View>
        <View>
          <Text style={{ fontSize: 9, color: "#6b7280" }}>Job Order No.</Text>
          <Text style={styles.jobNoValue}>{job.jobNo}</Text>
        </View>
      </View>

      {/* Job Information */}
      <Text style={styles.sectionTitle}>Job Information</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{job.location}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Subject:</Text>
        <Text style={styles.value}>{job.subject}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Reported By:</Text>
        <Text style={styles.value}>{job.reportedBy}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date Reported:</Text>
        <Text style={styles.value}>{new Date(job.createdAt).toLocaleDateString("th-TH")}</Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionBox}>
        <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 6 }}>Description:</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.8 }}>{job.description}</Text>
      </View>

      {/* Photo Evidence */}
      {job.photoUrl && <Image src={job.photoUrl} style={{ maxWidth: 300, marginTop: 10 }} />}

      {/* Signatures */}
      <View style={styles.signatureSection}>
        <View style={{ width: 200, alignItems: "center" }}>
          <Text style={{ fontSize: 10, color: "#6b7280", marginBottom: 40 }}>Reported By</Text>
          <View style={styles.signatureLine} />
          <Text style={{ fontSize: 9 }}>({job.reportedBy})</Text>
        </View>
        <View style={{ width: 200, alignItems: "center" }}>
          <Text style={{ fontSize: 10, color: "#6b7280", marginBottom: 40 }}>Supervisor Approved</Text>
          <View style={styles.signatureLine} />
          <Text style={{ fontSize: 9 }}>(..........................................)</Text>
        </View>
      </View>
    </Page>
  </Document>
)