import React from 'react'

const EmailTemplate = ({name, confirmLink}: {name: string, confirmLink: string}) => {
  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2.5rem",
        backgroundColor: "rgb(254 226 226)",
        borderRadius: "0.5rem"
      }} 
    >
      <h1 style={{textAlign: "center", fontSize: "1.5rem"}}>Welcome to quillread.</h1>
      <h4 style={{textAlign: "center", fontSize: "1.2rem"}}>Hi {name}, we are pleased to have you on quillread. To start using our service, you need to verify your email first.</h4>
      <p style={{textAlign: "center"}}>
        <a 
          style={{
            backgroundColor: "#333",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "1.1rem",
            textDecoration: "none",
          }} 
          href={confirmLink}
        >Verify your email</a>
      </p>

      <p 
        style={{
          marginTop: "2.5rem",
          textAlign: "left",
          fontSize: "0.75rem",
          lineHeight: "1.25rem"
        }}
      >
        If the above link doesn&apos;t work, click <a style={{color: "#333"}} href={confirmLink}>here</a>.
      </p>
    </div>
  )
}

export default EmailTemplate