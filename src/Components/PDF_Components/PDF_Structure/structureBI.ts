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
        marginLeft: '200px',
    },
    billTo: {
        marginBottom: 10,
    },

    concepto: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        maxWidth: '400px',
        marginTop: "15px",
    },

    table: {
        width: "100%",
        fontSize: "10px",
        // borderWidth: 1, //param para transparencia de borde
        // borderBottomWidth: 1, //param para transparencia de borde
        // borderStyle: "solid", //param para transparencia de borde
        // borderColor: "#fff" //param para transparencia de borde
        borderStyle: "dashed",
        borderColor: "#000",
        margin: "20px auto",
    },
    tableHeader: {
        backgroundColor: "#00352C",
        color: "#fff",
        borderRadius: "10px",
        margin: "0 -15px",
    },
    tableData: {
        margin: "0 -15px",
    },
    td: {
        padding: 3,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },

    totals: {
        display: "flex",
        alignItems: "flex-end",
    }

});
