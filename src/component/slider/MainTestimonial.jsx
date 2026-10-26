import React from "react";
import "./carousel.css";
import logo from "../../images/icon/profile01.png"
import logo01 from "../../images/icon/profile02.png"
import logo02 from "../../images/icon/profile03.png"
import logo03 from "../../images/icon/profile04.png"
import comaa from "../../images/icon/clipart.png"
const items = [
  { title: "The Wood Home", desc: "We got multiple courier options and detailed analytics in one platform saves a lot of time, & the lower shipping rates with reliable service make it even better.", image:logo, name:"Gagandeep Singh", posi: "Business Owner", coma:comaa },
  { title: "Warrior World", desc: <>Operational efficiency is what defines scalable brands, and <b>ParcelX</b> delivers exactly that. From courier allocation to deep analytics, it brings clarity and control to logistics</>, image:logo01, name:"Uday", posi: "Shark Tank Brand", coma:comaa},
  { title: "The Tstore9", desc: <>We ship products across India and <b>ParcelX</b> has helped us manage shipments efficiently and reduce RTO & weight issues</>, image:logo02, name:"Rajni", posi: "Business Owner", coma:comaa},
  { title: "Paint Buckets", desc: <>I started my small Instagram store last year and <b>ParcelX</b> made shipping super easy for me. The dashboard is simple to use and I can choose the best courier partner for each order. My deliveries are faster now and customers are happier.</>, image:logo03, name:"Akansha", posi: "Instagram Store Seller", coma:comaa }
];

export default function MarqueeCarousel() {
  return (
    <section className="section03 pb-0">
      <div className="marquee-container">
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => (
            <div className="marquee-card" key={i}>
              <p className="mb-24"><b>{item.title}</b></p>
              <p className="mb-48">{item.desc}</p>
              <div className="marquee-footer">
                <div className="marquee-content">
                  <img src={item.image} alt="" />
                  <div className="">
                    <h2>{item.name}</h2>
                    <p>{item.posi}</p>
                  </div>
                </div>
                <img src={item.coma} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
