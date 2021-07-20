import React, { useState } from "react";
import Search from "./Search";
import { getImagesByQuery } from "../services/pixabayService";
import Modal from "react-bootstrap/Modal";
import Masonry from "react-masonry-css";
import { toast } from "react-toastify";

function SearchImageModal(props) {
  const { show, onImageClick, handleClose } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState(null);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const res = await getImagesByQuery(searchQuery);
      console.log("res", res);
      if (res.data.hits.length === 0) toast("No results could be found");
      setImages(res.data.hits);
    } catch (error) {
      toast.error("An error occurred trying to get your images");
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    515: 2,
    400: 1,
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header>
        <Modal.Title>Search Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Search
          className="col-10 offset-1 d-flex mt-4 mb-4"
          onChange={handleSearchChange}
          onClick={handleSearchClick}
          value={searchQuery}
          placeholder="Search Food Images..."
        />
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images &&
            images.map((i) => (
              <div key={i.id}>
                <img
                  src={i.previewURL}
                  alt={i.tags[0]}
                  className="ingredient-img"
                  onClick={() => onImageClick(i.previewURL)}
                />
              </div>
            ))}
        </Masonry>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-secondary btn-sm shadow-sm"
          onClick={handleClose}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default SearchImageModal;
