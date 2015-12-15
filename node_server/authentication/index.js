module.exports = {
    login: function (user, password) {
        if (user == 'demo.old' && password === 'demoMMI') {
            return [{
                "IDUSUARIO": "41",
                "IDZONA": "1",
                "LOGIN": "demo.old",
                "PASS": "demoMMI",
                "NOMBRE": "Demo de Costa Rica",
                "APELLIDO1": "",
                "APELLIDO2": "",
                "EMAIL": "",
                "TWITTER": "",
                "TIPO": "U",
                "ACTIVO": "0",
                "TELEFONO": "",
                "CARGO": "",
                "IDTIPOUSUARIO": "0",
                "ULTIMOACCESO": "0000-00-00 00:00:00",
                "ENCUESTADO": "0"
            }];
        } else return null;

    },
    getCategories: function (user) {
        if (user != null) {
            return   [{"IDCATEGORIA": "2", "NOMBRE": "AYUNTAMIENTO TELDE. PARTIDOS POLITICOS"},
            {"IDCATEGORIA": "3", "NOMBRE": "PUBLICIDAD CONSEJERIA DE TURISMO"},
            {"IDCATEGORIA": "4", "NOMBRE": "PUBLICIDAD CONSEJERIA DE ECONOMIA Y HACIENDA"},
            {"IDCATEGORIA": "33", "NOMBRE": "COALICION POR GRAN CANARIA"}];
        } else return null;
    }
};