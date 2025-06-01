import { ClosureComponent, Component, Children } from "mithril";
import { m } from "./components.ts";
import * as store from "./store.ts";
import * as notifications from "./notifications.ts";
import * as overlay from "./overlay.ts";
import changePasswordComponent from "./change-password-component.ts";

export function init(
  args: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return Promise.resolve(args);
}

export const component: ClosureComponent = (): Component => {
  return {
    view: (vnode) => {
      if (window.username) m.route.set(vnode.attrs["continue"] || "/");

      document.title = "Login - Multivirtus ACS";
      return [
        m(".login-box", [
            m("h1.login-header", "Entrar"),
            m(
                "form",
                m(
                    ".form-group",
                    [
                        m("label", { for: "username" }, "Usuário"),
                        m("input", {
                            name: "username",
                            type: "text",
                            value: vnode.state["username"],
                            oncreate: (vnode2) => {
                                (vnode2.dom as HTMLInputElement).focus();
                            },
                            oninput: (e) => {
                                vnode.state["username"] = e.target.value;
                            },
                        }),
                    ]
                ),
                m(
                    ".form-group",
                    [
                        m("label", { for: "password" }, "Senha"),
                        m("input", {
                            name: "password",
                            type: "password",
                            value: vnode.state["password"],
                            oninput: (e) => {
                                vnode.state["password"] = e.target.value;
                            },
                        }),
                    ]
                ),
                m(
                    ".form-group",
                    m(
                        "button.login-button.primary",
                        {
                            type: "submit",
                            onclick: (e) => {
                                e.target.disabled = true;
                                store
                                    .logIn(vnode.state["username"], vnode.state["password"])
                                    .then(() => {
                                        location.reload();
                                    })
                                    .catch((err) => {
                                        notifications.push("error", err.response || err.message);
                                        e.target.disabled = false;
                                    });
                                return false;
                            },
                        },
                        "Login",
                    ),
                ),
            ),
            m(
                "a.login-footer",
                {
                    onclick: () => {
                        const cb = (): Children => {
                            const attrs = {
                                onPasswordChange: () => {
                                    overlay.close(cb);
                                    m.redraw();
                                },
                            };
                            return m(changePasswordComponent, attrs);
                        };
                        overlay.open(cb);
                    },
                },
                "Esqueci minha senha",
            ),
        ]),
    ];
    },
  };
};
