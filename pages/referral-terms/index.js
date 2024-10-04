import React from "react";
import nookies from "nookies";
import cls from "./content.module.scss";
import Footer from "../../components/footer";
import axiosService from "../../services/axios";

export default function ReferralTerms({ data, error }) {
  if (error) {
    console.log("error => ", error);
  }

  return (
    <>
      <div className={`container ${cls.container}`}>
        <div className={cls.header}>
          <h1 className={cls.title}>{data?.translation?.title}</h1>
          <p className={cls.text}></p>
        </div>
        <main className={cls.content}>{data?.translation?.description}</main>
        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps(ctx) {
  const cookies = nookies.get(ctx);
  const lang = cookies?.language_locale;

  try {
    const res = await axiosService.get(`/rest/referral`, { lang });
    const data = await res.data.data;

    return {
      props: {
        data,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
        error: error,
      },
    };
  }
}
