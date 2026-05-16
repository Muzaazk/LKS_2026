import { useState } from "react";

function App() {
  const [elements, setElements] = useState([]);

  // Saat mulai drag
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
  };

  // Biar bisa drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Saat drop ke canvas
  const handleDrop = (e) => {
    const type = e.dataTransfer.getData("type");

    if (type === "text") {
      setElements([...elements, { type: "text", content: "Edit saya" }]);
    } else if (type === "button") {
      setElements([...elements, { type: "button", content: "Click" }]);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Sidebar */}
      <div style={{ width: "150px" }}>
        <h3>Komponen</h3>

        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "text")}
          style={{
            padding: "10px",
            border: "1px solid black",
            cursor: "grab",
          }}
        >
          Text
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "button")}
          style={{
            padding: "10px",
            border: "1px solid black",
            cursor: "grab",
          }}
        >
          Button
        </div>
      </div>

      {/* Canvas */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          flex: 1,
          minHeight: "300px",
          border: "2px dashed gray",
          padding: "10px",
        }}
      >
        <h3>Canvas</h3>

        {elements.map((el, index) => {
          if (el.type === "text") {
            return (
              <p key={index} contentEditable>
                {el.content}
              </p>
            );
          } else if (el.type === "button") {
            return (
              <button type={el.type} key={index} contentEditable>
                {el.content}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;
// import { useState } from "react";

// function App() {
//   const [elements, setElements] = useState([]);

//   // Tambah teks
//   const addText = () => {
//     setElements([...elements, { type: "text", content: "Edit saya" }]);
//   };

//   // Update isi teks
//   const updateText = (index, newContent) => {
//     const updated = [...elements];
//     updated[index].content = newContent;
//     setElements(updated);
//   };

//   // Generate HTML
//   const generateHTML = () => {
//     let html = "";

//     elements.forEach((el) => {
//       if (el.type === "text") {
//         html += `<p>${el.content}</p>\n`;
//       }
//     });

//     const fullHTML = `
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Hasil Web</title>
// </head>
// <body>
// ${html}
// </body>
// </html>
//     `;

//     console.log(fullHTML);
//     alert("HTML berhasil di-generate! Cek console.");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Mini Web Builder</h1>

//       {/* Toolbar */}
//       <button onClick={addText}>Tambah Teks</button>
//       <button onClick={generateHTML} style={{ marginLeft: "10px" }}>
//         Export HTML
//       </button>

//       {/* Canvas */}
//       <div
//         style={{
//           border: "1px solid black",
//           minHeight: "300px",
//           marginTop: "20px",
//           padding: "10px",
//         }}
//       >
//         {elements.map((el, index) => {
//           if (el.type === "text") {
//             return (
//               <p
//                 key={index}
//                 contentEditable
//                 suppressContentEditableWarning={true}
//                 onInput={(e) => updateText(index, e.currentTarget.textContent)}
//                 style={{
//                   border: "1px dashed gray",
//                   padding: "5px",
//                 }}
//               >
//                 {el.content}
//               </p>
//             );
//           }
//           return null;
//         })}
//       </div>
//     </div>
//   );
// }

// export default App;
