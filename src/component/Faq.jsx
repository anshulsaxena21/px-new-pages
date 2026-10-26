import React from "react";
import accordion from "../images/hover-img/accordion.png";
import box from "../images/hover-img/parcel-box.png";
export default function Faq({ title, faqs }) {
  return (
    <section>
      <div className="col-md-11 mx-auto">
        <h2 className="heading">
          <span>{title?.highlight}</span> {title?.text}
        </h2>

        <div className="row">
          <div className="col-md-6">
            <div className="accordion" id="accordionExample">
              {faqs.map((item, index) => {
                const collapseId = `collapse${index}`;
                const headingId = `heading${index}`;

                return (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header" id={headingId}>
                      <button
                        className={`accordion-button ${
                          index !== 0 ? "collapsed" : ""
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded={index === 0 ? "true" : "false"}
                        aria-controls={collapseId}
                      >
                        {item.question}
                      </button>
                    </h2>

                    <div
                      id={collapseId}
                      className={`accordion-collapse collapse ${
                        index === 0 ? "show" : ""
                      }`}
                      aria-labelledby={headingId}
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-6 d-md-block d-none">
            <div className="image-box">
              <img src={accordion} className='img-fluid' alt="" /> 
              <img src={box} className='img-box' alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
