// Convention:
// - Everything lowercase is an object
// - Everything uppercase is a string (the route)

import { keys } from '../keys';

export const baseUrl = {
  web: keys().NEXT_PUBLIC_QUIZ_URL,
  api: keys().NEXT_PUBLIC_API_URL
} as const;

export const routes = {
  web: {
    api: `${baseUrl.web}/api`,
    index: `${baseUrl.web}/`,
    quiz: {
      index: `${baseUrl.web}/quiz`,
      step: (step: number) => `${baseUrl.web}/quiz/step/${step}`,
      result: `${baseUrl.web}/quiz/result`
    }
  },
  api: {
    index: `${baseUrl.api}/`,
    calculate: `${baseUrl.api}/calculate`
  }
} as const;

export function getPathname(route: string, baseUrl: string): string {
  return new URL(route, baseUrl).pathname;
}
