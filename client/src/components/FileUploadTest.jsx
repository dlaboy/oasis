import React, { useState } from "react";
import axios from 'axios';


function FileUpload() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploaded,setUploaded] = useState(false)
 const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent form default submission behavior

  let formData = new FormData();
  formData.append("file", file.data); // Append the file to the FormData object

  try {
    const response = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Inform the server of the data format
      },
    });

    if (response.status === 200 && response?.data) {
      const responseWithBody = response.data; // Access response data
      setUrl(responseWithBody.publicUrl); // Update state with the received URL
      setUploaded(true)
      window.location.reload()

    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};


  const handleFileChange = (e) => {
    const file = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFile(file);
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" onChange={handleFileChange}></input>
      <button type="submit">Submit</button>
    </form>
    {isUploaded && <>{alert("File Uploaded!")}</>}
    </>

  );
}

export default FileUpload;