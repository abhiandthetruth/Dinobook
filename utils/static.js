import { send } from "https://deno.land/x/oak/mod.ts";

const getStatic = async context => {
    await send(context, context.request.url.pathname,{
        root: `${Deno.cwd()}/assets`,
        index: "index.html",
    })
}

export default getStatic