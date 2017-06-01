Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  resources :users, only: [:profile] do
    member do
      get "profile"
    end
  end

  scope "/admin" do
    resources :users
  end
  root 'welcome#index'
  resources :welcome do
    collection do
      get 'about'
      get 'advise'
    end
  end
  resources :patterns do
    collection do
      get 'new_from_img'
    end
  end
  resources :messages
  resources :colors
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
