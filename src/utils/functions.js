

export function TransformISOdate(pickedDate){


// Fecha original en el formato "Sat Jul 08 2023 00:00:00 GMT-0300 (hora estándar de Uruguay)"
const fechaOriginal = new Date(pickedDate);

// Obtener los componentes individuales de la fecha
const year = fechaOriginal.getUTCFullYear();
const month = String(fechaOriginal.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por lo que sumamos 1.
const day = String(fechaOriginal.getUTCDate()).padStart(2, '0');
/*const hours = String(fechaOriginal.getUTCHours()).padStart(2, '0');
const minutes = String(fechaOriginal.getUTCMinutes()).padStart(2, '0');
const seconds = String(fechaOriginal.getUTCSeconds()).padStart(2, '0');*/

// Construir la cadena de fecha en el formato requerido "YYYY-MM-DDTHH:mm:ssZ"
const fechaConvertida = `${year}-${month}-${day}T00:00:00.000Z`;

return fechaConvertida;
}


export function ConvertISOdateToRegular(isodate){

    if(isodate){

        let arr=isodate.split("T")
        let arr2=arr[0].split("-")
    
        return(`${arr2[2]}/${arr2[1]}/${arr2[0]}`)

    }

  
}



export function orderByDate(array) {
    // Utilizamos el método sort para ordenar el array de objetos por la propiedad 'fecha'
    array.sort((a, b) => new Date(b.date_report) - new Date(a.date_report));
    return array;
  }




  export function emailReport(report){

    return(`
    <html>
    <head>
    <title>Welcome to</title>
    <style>
        @import url('https://fonts.googleapis.com/css?family=Cabin');
        body { margin: 0; padding: 0; left: 0; top: 0; background-color: white; }
        h1 { font-family: 'Cabin'; font-weight: 600; color: rgba(5,45,84,1); margin-left: 2px;}
        p { font-family: 'Cabin'; font-weight: 400; font-size: 11pt; color: rgba(5,45,84,1); margin-left: 2px; }
        h3 {
            margin-top: 50px;
            color: rgba(5,45,84,.25);
            font-family: 'Cabin'; 
            font-weight: 400; 
            font-size: 10pt;
            width: 80vw;
        }
        h2 {
            text-align: center;
            margin-top: 25px;
            margin-bottom: 10px;
            color: rgba(5,45,84,1);
            font-family: 'Cabin'; 
            font-weight: 400; 
            font-size: 10pt;
        }
        h3 > a { color: rgba(118,146,255,1); }
        h3 > a:hover { cursor: pointer; }
        h3 > a:active { opacity: .75; }
        .page-container { width: 80vw; margin-left: 10vw; }
        .logo { margin-left: 2px; height: 30px; margin-top: 20px; margin-bottom: 20px; }
        .divider { height: 1px; width: 100%; background-color: rgba(5,45,84,.1); margin-bottom: 40px; }
        .button-container {
            width: 100%;
            height: 50px;
            margin-top: 25px;
            margin-bottom: 25px;
            display: flex;
            flex-direction: column;
        }
        .cta {
            transition: all 200ms; 
            -webkit-transition: all 200ms; 
            -moz-transition: all 200ms; 
            -o-transition: all 200ms;
            -ms-transition: all 200ms;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 46px;
            color: white;
            font-size: 11pt;
            font-family: 'Cabin';
            font-weight: 500;
            padding-left: 20px;
            padding-right: 20px;
            background-color: #7692FF;
            border-radius: 5px;
            margin-top: 0px;
            margin-bottom: 4px;
            box-shadow: 0px 4px rgba(118,146,255,.25);
        }
        .cta:hover {
            cursor: pointer;
        }
        .cta:active {
            margin-top: 4px;
            margin-bottom: 0px;
            box-shadow: 0px 0px rgba(118,146,255,.25);
        }
        .footer-container {
            width: 100%;
            margin-top: 50px;
            padding-bottom: 10px;
            background-color: rgba(5,45,84,.04);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
    </head>
    <body>
        <div class="page-container">
        <div class="divider"></div>
        <h1>Welcome to</h1>
        <p>
            Hi Matthew, thanks for signing up for. We're so happy to have you! almost ready to join your first group. Click the link below to verify your email.
        </p>
        <div class="button-container">
            <div class="cta">
            GET STARTED
            </div>
        </div>
        <p>
            We'll reach out again when we're ready for you to start using. Just reply to this email if you have any questions.
        </p>
        <p>
            ${report.device}
        </p>
        </div>
        <div class="footer-container">
        <h3 class="footer">
            If you need help, respond to this message. If this message was sent to you by mistake and you did not sign up for an account with us, we apologize.
        </h3>
        <h2>a9 Something 2018</h2>
        </div>
    </body>
</html>`)
  }