import { useCallback, useState } from 'react'
import { TypeListItem } from './TypeListItem'
import axios from 'axios'

// 동일한 config 값 들을 가지고있는 axiosInstance
const axiosInstance = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/', // 주로 서버 URL == host
})

const API_KEY = 'AIzaSyApZmz9J1Z3ekIfhKKfByc_qvyhomHApMI'

export const useData = () => {
    const [ data, setData ] = useState<TypeListItem[]>([])
    
    const loadData = useCallback(async() => {
        
        try {
            // baseURL 로 get 요청 => '/video' 엔드포인트로 요청, 파라미터로는 호출할 때 사용되는 config(매개변수) 값
            const videoResults = await axiosInstance.get<{
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
            }>('/videos', {
                params: {
                    key: API_KEY,
                    part: 'snippet, contentDetails, statistics',
                    chart: 'mostPopular',
                    // 국가코드
                    regionCode: 'KR',
                },
            })
            
            const videoData = videoResults.data
            setData(videoData.items.map(( item ) => ({
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                publishedAt: item.snippet.publishedAt,
                viewCount: item.statistics.viewCount,
                channelTitle: item.snippet.channelTitle,
            })))
        } catch(ex) {
            console.log(ex)
        }
        
    }, [])
    
    return {
        data,
        loadData,
    }
}