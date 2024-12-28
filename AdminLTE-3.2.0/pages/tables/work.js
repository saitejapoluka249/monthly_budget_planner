function eval()
{
    var table = document.getElementById("example2");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
       var row = table.rows[i];
        row.onclick = function(){
                          var mname = this.getElementsByTagName("td")[0];
                          var mid = this.getElementsByTagName("td")[1];
                          var mphno = this.getElementsByTagName("td")[2];
                          var memail = this.getElementsByTagName("td")[3];
                          var mgen = this.getElementsByTagName("td")[4]; 
                          var A=mname.innerHTML;
                          var B=mid.innerHTML;
                          var C=mphno.innerHTML;
                          var D=memail.innerHTML;
                          var E=mgen.innerHTML;
                          localStorage.setItem("F",A);
                          localStorage.setItem("G",B);
                          localStorage.setItem("H",C);
                          localStorage.setItem("I",D);
                          localStorage.setItem("J",E);
                          window.location.href="form_monday.html"
                          
                      };
    }
}