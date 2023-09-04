import { useCallback, useState } from 'react'
import { TypeListItem } from './TypeListItem'
import axios from 'axios'

// type 재 선언
type TypeVideoListResponse = {
  kind: 'youtube#videoListResponse';
                etag: string;
                nextPageToken: string;
                prevPageToken: string;
                pageInfo: {
                  totalResults: number;
                  resultsPerPage: number;
                };
                items: {
                    kind: 'youtube#video';
                    etag: string;
                    id: string;
                    snippet: {
                      publishedAt: string;
                      channelId: string;
                      title: string;
                      description: string;
                      thumbnails: {
                        [key: string]: {
                          url: string;
                          width: number;
                          height: number;
                        };
                      };
                      channelTitle: string;
                      tags: string[];
                      categoryId: string;
                    };
                    contentDetails: {
                      duration: string;
                      dimension: string;
                      definition: string;
                      caption: string;
                      licensedContent: boolean;
                      regionRestriction: {
                        allowed: [string];
                        blocked: [string];
                      };
                      contentRating: {
                        mpaaRating: string;
                        tvpgRating: string;
                        bbfcRating: string;
                        chvrsRating: string;
                        eirinRating: string;
                        cbfcRating: string;
                        fmocRating: string;
                        icaaRating: string;
                        acbRating: string;
                        oflcRating: string;
                        fskRating: string;
                        kmrbRating: string;
                        djctqRating: string;
                        russiaRating: string;
                        rtcRating: string;
                        ytRating: string;
                      };
                    };
                    statistics: {
                      viewCount: number;
                      likeCount: number;
                      dislikeCount: number;
                      favoriteCount: number;
                      commentCount: number;
                    }
                }[]
            }
// 동일한 config 값 들을 가지고있는 axiosInstance
const axiosInstance = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/', // 주로 서버 URL == host
})

const API_KEY = 'app_key'

export const useData = () => {
    const [ data, setData ] = useState<TypeListItem[]>([])
    const [hasNextPage, setHasNextPage] = useState<Boolean> (true) // 초기 값 true
    const [nextPageCursor, setNextPageCursor] = useState<string | null> (null) // 초기 값 null
    
    const loadData = useCallback(async() => {
        
        try {
          const videoResults = await axiosInstance.get<TypeVideoListResponse>(
            '/videos',
            {
              params: {
                key: API_KEY,
                part: 'snippet, contentDetails, statistics',
                chart: 'mostPopular',
                regionCode: 'KR',
              },
            },
          );
          
          const videoData = videoResults.data;
          setData(
          videoData.items.map(item => ({
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              publishedAt: item.snippet.publishedAt,
              viewCount: item.statistics.viewCount,
              channelTitle: item.snippet.channelTitle,
          })),
        );
        
          setHasNextPage(typeof videoData.nextPageToken !== 'undefined');
          setNextPageCursor(
          typeof videoData.nextPageToken !== 'undefined'
            ? videoData.nextPageToken
            : null,
          );
        } catch(ex) {
            console.log(ex)
        }
        
    }, [])
    
    // 스크롤이 끝난 경우 새로 불러올 데이터
    const loadMoreData = useCallback(async() => {
      
      // 다음 페이지가 없을 경우 요청 x
      if(!hasNextPage) return
      
      try {
        // baseURL 로 get 요청 => '/video' 엔드포인트로 요청, 파라미터로는 호출할 때 사용되는 config(매개변수) 값
        const videoResults = await axiosInstance.get<TypeVideoListResponse>(
          '/videos', 
          {
            params: {
                key: API_KEY,
                part: 'snippet, contentDetails, statistics',
                chart: 'mostPopular',
                // 국가코드
                regionCode: 'KR',
                // item 이후 데이터를 가져와야하므로 파라미터 추가
                pageToken: nextPageCursor,
            },
          }
        )
        
        const videoData = videoResults.data
        // concat 메소드를 통해 기존의 데이터 뒤에 새로운 데이터 이어붙이기
        setData(prevData =>
          prevData.concat(
            videoData.items.map(( item ) => ({
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              publishedAt: item.snippet.publishedAt,
              viewCount: item.statistics.viewCount,
              channelTitle: item.snippet.channelTitle,
            })),
          )
        )
        
        // binding
        // videoData 에서 nextPageToken 이 존재할 때 true
        setHasNextPage(typeof videoData.nextPageToken !== 'undefined')
        // videoData 에서 nextePageToken 이 존재할 때 true 고,
        // 존재하지 않다면 null
        setNextPageCursor(
          typeof videoData.nextPageToken !== 'undefined' 
            ? videoData.nextPageToken 
            : null,
            )
      } catch (ex) {
        console.error(ex)
      }
    }, [hasNextPage, nextPageCursor])
    
    return {
        data,
        loadData,
        loadMoreData,
    }
}