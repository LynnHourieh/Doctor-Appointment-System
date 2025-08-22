import React, { useRef, useState, useCallback } from "react";
import { Oval } from "react-loader-spinner";
import "./infinite-scroll-styles.scss";
import type { InfiniteScrollProps } from "../../models/components";

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  itemsToShow,
  renderItem,
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreElement = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      if (page * itemsToShow >= items.length) {
        setHasMore(false);
        return;
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const loadMore = () => {
    setLoading(true);

    // Simulate loading more items by updating the page
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 500);
  };

  const visibleItems = items.slice(0, page * itemsToShow);

  return (
    <>
      {visibleItems.map((item) => (
        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
      ))}

      {/* Add a ref to this container to observe its intersection */}
      <div ref={loadMoreElement} style={{ height: "10px", width: "100%" }} />

      {loading && (
        <div className="infinite-loader">
          <Oval
            height={30}
            width={30}
            color="#878787"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#878787"
            strokeWidth={6}
            strokeWidthSecondary={6}
          />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
