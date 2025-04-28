const gst_data = {
    "gst": [
      {
        "value1": "18%",
        "value2": "CGST",
        "value3": "SGST",
        "value4": "9%",
        "value5": "9%"
      },
      {
        "value1": "12%",
        "value2": "CGST",
        "value3": "SGST",
        "value4": "6%",
        "value5": "6%"
      },
      {
        "value1": "5%",
        "value2": "CGST",
        "value3": "SGST",
        "value4": "2.5%",
        "value5": "2.5%"
      }
    ]
  }
  

  gst_data.gst.forEach((item,index)=>{
    console.log(`Object #${index + 1} :`);
    Object.entries(item).forEach(([key,value])=>{
        console.log(`${key} : ${value}`);
        
    })
    
  })

