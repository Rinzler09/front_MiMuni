import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {

        backgroundColor: '#fff',
        color: '#262626',
        fontFamily: 'Helvetica',
        fontSize: '12px',
        padding: '30px 50px',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    img: {
        width: '90px',
    },
    title: {
        margin: '0 auto 15px',
        fontSize: 24,
    },
    title2: {
        margin: '0 auto',
        fontSize: 16,
    },
    textBold: {
        fontFamily: 'Helvetica-Bold',
    },
    topData: {
        display: 'flex',
        flexDirection: 'row',
    },
    spaceY: {
        display: 'flex',
        flexDirection: 'column',
    },
    date: {
        marginLeft: '250px',
    },
    billTo: {
        marginBottom: 10,
    },

    table: {
        width: "100%",
        borderColor: "1px solid #f3f4f6",
        margin: "20px 0"
    },
    tableHeader: {
        backgroundColor: "#e5e5e5",
    },
    td: {
        padding: 6,
    },

    totals: {
        display: "flex",
        alignItems: "flex-end",
    }

});