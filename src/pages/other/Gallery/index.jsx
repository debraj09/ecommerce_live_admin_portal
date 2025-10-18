import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// components
import PageTitle from '../../../components/PageTitle';
import Loader from '../../../components/Loader';

// dummy data
import { gallery as data } from './data';
import GlightBox from '@/components/GlightBox';
const Gallery = () => {
  const [gallery, setGallery] = useState(data);
  const [category, setCategory] = useState('all');
  const [galleryImages, setGalleryImages] = useState((data || []).map(album => {
    return album.image;
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  /**
   * filter images by category
   * @param category category
   */
  const filterImages = category => {
    setIsLoading(true);
    setCategory(category);
    setTimeout(() => {
      const galleryAlbums = category === 'all' ? data : data.filter(album => album.category?.includes(category));
      setGallery(galleryAlbums);
      setGalleryImages((galleryAlbums || []).map(album => {
        return album.image;
      }));
      setIsLoading(false);
    }, 300);
  };

  /*
   * handle lightbox events
   */
  const openLightbox = index => {
    setPhotoIndex(index);
    setIsOpen(true);
  };
  return <>
      <PageTitle breadCrumbItems={[{
      label: 'Extra Pages',
      path: '/pages/gallery'
    }, {
      label: 'Gallery',
      path: '/pages/gallery',
      active: true
    }]} title={'Gallery'} />

      <Row>
        <Col>
          <div className="text-center filter-menu">
            <Link to="#" className={classNames('filter-menu-item', 'me-1', {
            active: category === 'all'
          })} onClick={() => filterImages('all')}>
              All
            </Link>
            <Link to="#" className={classNames('filter-menu-item', 'me-1', {
            active: category === 'web'
          })} onClick={() => filterImages('web')}>
              Web Design
            </Link>
            <Link to="#" className={classNames('filter-menu-item', 'me-1', {
            active: category === 'graphic'
          })} onClick={() => filterImages('graphic')}>
              Graphic Design
            </Link>
            <Link to="#" className={classNames('filter-menu-item', 'me-1', {
            active: category === 'illustrator'
          })} onClick={() => filterImages('illustrator')}>
              Illustrator
            </Link>
            <Link to="#" className={classNames('filter-menu-item', 'me-1', {
            active: category === 'photography'
          })} onClick={() => filterImages('photography')}>
              Photography
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="filterable-content position-relative">
        {isLoading && <Loader />}
        {(gallery || []).map((item, index) => {
        return <Col sm={6} xl={3} key={index} className="filter-item  all web illustrator">
              <div className="gal-box">
                <Link to="#" className="image-popup" title={item.image.caption} onClick={() => openLightbox(index)}>
                  <GlightBox href={item.image.src}>
                    <img src={item.image.src} alt="" className="img-fluid" />
                  </GlightBox>
                </Link>

                <div className="gall-info">
                  <h4 className="font-16 mt-0">{item.title}</h4>
                  <Link to="#">
                    <img src={item.avatar} alt="user-img" className="rounded-circle" height="24" />
                    <span className="text-muted ms-1">{item.userName}</span>
                  </Link>
                  <Link to="#" className="gal-like-btn">
                    <i className="mdi mdi-heart-outline text-danger"></i>
                  </Link>
                </div>
              </div>
            </Col>;
      })}
      </Row>
    </>;
};
export default Gallery;