
import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
import { styles } from './style';

export default function ReportBI() {
    const ReportePDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>

            </Page>
        </Document>
    )
    return (
        <div>
            <div className='w-full h-[750px]'>
                <PDFViewer width="100%" height="100%">
                    <ReportePDF />
                </PDFViewer>
            </div>

        </div>
    );
}

