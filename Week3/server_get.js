const express= require("express");
    const app= express();
    app.use(express.static('public'))

    const addTwoNumber= (n1,n2) => {
        return n1+n2;
    }

    app.get("/addTwoNumber", (req,res)=>{
        const n1= parseInt(req.query.n1);
        const n2=parseInt(req.query.n2);
        const result = addTwoNumber(n1,n2);
        res.json({statuscocde:200, data: result }); 
    });

    app.get("/Display", (req, res) => {
        const n1 = "<html><body><H1>HELLO THERE </H1></body></html>";
        res.set('Content-Type', 'text/html');
        res.send(Buffer.from(n1));     
    })
    console.log (addTwoNumber(19,12));
    const port=3040;
    app.listen(port,()=> {
        console.log("hello i'm listening to port "+port);
    })

    function includeHTML() {
        const elements = document.querySelectorAll('[data-include]');
        elements.forEach(el => {
          const file = el.getAttribute('data-include');
          if (file) {
            fetch(file)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.text();
              })
              .then(data => {
                el.innerHTML = data;
              })
              .catch(error => {
                console.error('Error loading file:', error);
                el.innerHTML = 'Content not found.';
              });
          }
        });
      }