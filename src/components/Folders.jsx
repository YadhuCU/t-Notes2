import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Folder } from "./Folder";
import { TimeSort } from "./TimeSort";
import { AddFolder } from "./AddFolder";
import { useEffect } from "react";
import { getAllFoldersAPI } from "../services/allAPIs";
import { useSelector, useDispatch } from "react-redux";
import { addFoldersToStore } from "../redux/addFolderSlice";

export const Folders = () => {
  const { folders } = useSelector((state) => state.folder);
  const dispatch = useDispatch();

  const getAllFolders = async () => {
    try {
      const { data } = await getAllFoldersAPI();
      dispatch(addFoldersToStore([...data].reverse()));
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  useEffect(() => {
    getAllFolders();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(235deg, #fef2f2, #f0fdfa)",
      }}
      className="container  flex flex-col w-full items-center lg:items-start shadow-2xl rounded-[20px] sticky top-[-130px] z-10 px-4 py-4 mt-5"
    >
      <h1 className="text-5xl">Recent Folders</h1>
      <TimeSort type={"folder"} />
      <div
        className="mt-10 max-w-full "
        style={{ width: "calc(100vw - 70px)" }}
      >
        <Swiper
          slidesPerView={2.3}
          spaceBetween={50}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
            1704: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="rounded-[20px] border-dashed border-2 border-slate-400 w-40 h-24 md:w-60 md:h-40 flex justify-center items-center text-3xl">
              <AddFolder />
            </div>
          </SwiperSlide>
          {folders?.map((item, index) => (
            <SwiperSlide key={index}>
              <Folder folder={item} home={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

{
  /* Modal */
}
