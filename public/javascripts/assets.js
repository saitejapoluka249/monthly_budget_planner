function gene()
{
    a=document.getElementById("name").value; 
    b=document.getElementById("phone-number").value;
    c=document.getElementById("email").value;
    d=document.getElementById("password").value;
    j=document.getElementById("filess").files.length; 
    f=document.querySelector('Input[name="Gender"]:checked');
    g=document.getElementById("birthdate").value; 
    h=document.querySelectorAll('Input[type="checkbox"]:checked'); 
    i=document.getElementById("Url").value;
    validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(a=="" || b=="" || c=="" || d=="" || !f || g=="" || h.length<1 || i=="" || j<1) 
    {
        alert("Please fill every field!!");
    } 
    else if(!validRegex.test(c) || !re.test(b) || !decimal.test(d))
    {alert("please enter in proper format as shown in form");
}
    else
    {
      alert("Name is "+a+"\n Email id is "+c+"\n Password is "+d+"\n your date of birth is"+g+"\n File has been submitted \n Image has been uploaded "+"\n Gender is "+f.value+"\n Url is "+i+"\n Hobbies selected are"+h.length);
    }

}
